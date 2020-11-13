import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestService } from '../../../../services/test.service';
import { TubeService } from '../../../../services/tube.service';
import { LocalDataSource } from 'ng2-smart-table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputNumberComponent } from '../../../../@theme/components/table-render/InputNumber.component';
import { Test, TestFormula } from '../../../../models/test';
import { ToastService } from '../../../../services/toast.service';
import './ckeditor.loader';
import 'ckeditor';


interface PrimaryUnit {
  value: string;
  viewValue: string;
}
@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ngx-dialog-test-manager], [ngx-ckeditor]',
  templateUrl: './dialog-test-manager.component.html',
  styleUrls: ['./dialog-test-manager.component.scss']
})

export class DialogTestManagerComponent implements OnInit {

  test: Test[] = [];

  // general tab
  tube: any;
  primaryUnit: PrimaryUnit[] = [
    { value: '%', viewValue: '%' },
    { value: '%Quick', viewValue: '%Quick' },
    { value: 'C0l', viewValue: 'C0l' },
    { value: 'cm', viewValue: 'cm' },
    { value: 'cmH2O', viewValue: 'cmH2O' },
    { value: 'G/l', viewValue: 'G/l' },
    { value: 'Pulgada', viewValue: 'Pulgada' },
    { value: 'PG/24', viewValue: 'PG/24' },
    { value: 'INR', viewValue: 'INR' },
    { value: 'IU/ml', viewValue: 'IU/ml' },
    { value: 'Kg', viewValue: 'Kg' },
    { value: 'kJU/I', viewValue: 'kJU/I' },
    { value: 'µIU/ml', viewValue: 'µIU/ml' },
    { value: 'µU/ml', viewValue: 'µU/ml' }
  ];

  title: string;
  testAll = [];
  buttonTitle: string;
  testContentForm = {
    code: null,
    description: null,
    abbreviation: null,
    isMicro: null,
    printable: null,
    status: true,
  };

  testVersionContentForm = {
    tubeId: null,
    primaryUnit: null,
    formula: null,
    formulaVariables: null,
    versionDate: null,
  };
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogTestManagerComponent>,
    public dialog: MatDialog,
    public testService: TestService,
    public tubeService: TubeService,
    private readonly snackBar: MatSnackBar,
    private readonly toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
  ) {
    this.rangeSource = new LocalDataSource(this.ranges);
    this.formulaSource = new LocalDataSource(this.formulas);
  }

  async ngOnInit() {
    // dialog format
    this.loading = true;
    this.title = this.getData['title'];
    this.buttonTitle = this.getData['buttonTitle'];

    try {
      const tube = await this.tubeService.getAll().toPromise();
      this.tube = tube && tube.status ? tube.data.filter(d => d.status) : [];
      const res = await this.testService.getAll().toPromise();
      this.test = res && res.status ? res.data : [];
      this.testAll = [];
      this.test.forEach((nk) => {
        this.testAll.push({
          value: Number(nk.id),
          title: `${nk.code} ${nk.description}`,
        });
      });

      this.formulaTableSettings.columns.testId.editor.config.list = this.testAll;
      if (this.getData['test']) {
        const test = await this.testService.getLastVersionByTestId(this.getData['test'].id).toPromise();
        this.testContentForm.abbreviation = test.data.abbreviation;
        this.testContentForm.code = test.data.code;
        this.testContentForm.description = test.data.description;
        this.testContentForm.isMicro = test.data.isMicro;
        this.testContentForm.printable = test.data.printable;
        this.testContentForm.status = test.data.status;
        this.testVersionContentForm.tubeId = test.data.testVersion.tubeId;
        this.testVersionContentForm.primaryUnit = test.data.testVersion.primaryUnit;
        this.testVersionContentForm.formula = test.data.testVersion.formula;
        this.testVersionContentForm.versionDate = null;
        if (test.data.testVersion.formula) {
          this.disabledFormula = true;
        }
        if (test.data.testReferenceRange) {
          this.rangeSource.load(test.data.testReferenceRange);
        }
        if (test.data.testFormula) {
          this.showFormulaTable = true;
          this.formulaSource.load(test.data.testFormula);
        }
      }
      this.loading = false;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }

  }

  assignVariables(newVar) {
    if (newVar) {
      this.showFormulaTable = true;
      const splittedNewVar = newVar.split('');

      this.formulas.forEach((fr) => {
        if (!splittedNewVar.find(s => fr.variableName === s)) {
          this.formulas = this.formulas.filter(formula => formula !== fr);
        }
      });
      const pattern = /[A-Za-z]/;
      const newVariables: TestFormula[] = splittedNewVar.map(v => {
        return pattern.test(v) && !this.formulas.find(f => f.variableName === v) ?
          {
            variableName: v,
            testId: 0,
            status: true,
            userId: 1,
          } : null;
      }).filter(Boolean);
      const uniqueNewVariables = [...new Set(newVariables.map(v => v.variableName))];
      this.formulas.push(...uniqueNewVariables.map(u => newVariables.find(v => v.variableName === u)));
      this.formulaSource.load(this.formulas);
    } else {
      this.showFormulaTable = false;
      this.formulas = [];
      this.formulaSource.load(this.formulas);
      this.testVersionContentForm.formulaVariables = false;
    }
  }
  async manageTest() {
    if (this.validateForm()) {
      // form
      const dataTest = Object.assign({});
      const testVersion = Object.assign({});
      dataTest.abbreviation = this.testContentForm.abbreviation;
      dataTest.code = this.testContentForm.code;
      dataTest.description = this.testContentForm.description;
      dataTest.isMicro = this.testContentForm.isMicro ? true : false;
      dataTest.printable = this.testContentForm.printable ? true : false;
      dataTest.status = this.testContentForm.status;
      dataTest.userId = 1;

      testVersion.tubeId = this.testVersionContentForm.tubeId;
      testVersion.primaryUnit = this.testVersionContentForm.primaryUnit;
      testVersion.formula = this.testVersionContentForm.formulaVariables ? this.testVersionContentForm.formula : '';
      testVersion.versionDate = '2020-08-07';
      testVersion.automaticResult = 'some';
      testVersion.comment = 'some';
      testVersion.status = true;
      testVersion.userId = 1;
      dataTest.testVersion = testVersion;

      if (this.formulaSource['data'] && this.testVersionContentForm.formulaVariables) {
        const newFormulas = [];
        this.formulaSource['data'].forEach((nk) => {
          newFormulas.push({
            testId: Number(nk.testId),
            variableName: nk.variableName,
            status: true,
            userId: 1,
          });
        });
        dataTest.testFormula = newFormulas;
      } else {
        dataTest.testFormula = [];
      }

      if (this.ranges) {
        const newRanges = [];
        this.rangeSource['data'].forEach((nk) => {
          newRanges.push({
            physiology: nk.physiology,
            literal: nk.literal,
            startRangeUnit: String(nk.startRangeUnit),
            endRangeUnit: String(nk.endRangeUnit),
            low: nk.low,
            high: nk.high,
            panicLow: nk.panicLow ? nk.panicLow : null,
            panicHigh: nk.panicHigh ? nk.panicHigh : null,
            alertLow: nk.alertLow ? nk.alertLow : null,
            alertHigh: nk.alertHigh ? nk.alertHigh : null,
            userId: 1,
          });
        });
        dataTest.testReferenceRange = newRanges;
      } else {
        dataTest.testReferenceRange = [];
      }
      try {
        if (this.getData['test']) {
          await this.testService.update(this.getData['test'].id, dataTest).toPromise();
          this.toastService.showToast('success', 'Confirmación', 'Registro actualizado');
        } else {
          await this.testService.add(dataTest).toPromise();
          this.toastService.showToast('success', 'Confirmación', 'Registro creado exitósamente');
        }
        this.dialogRef.close(true);
      } catch (error) {
        this.toastService.showError(error.message || error);
      }
    }
  }

  onDeleteConfirm(event) {
    event.confirm.resolve();
    this.openSnackBar('Suspensión registro', 'ELIMINADO');
  }

  onCreateConfirm(event) {
    if (this.validateSmartTable(event)) {
      event.confirm.resolve();
      this.openSnackBar('Creación registro', 'CREADO');
    }
  }

  onSaveConfirm(event) {
    if (this.validateSmartTable(event)) {
      event.confirm.resolve();
      this.openSnackBar('Actualización registro', 'EDITADO');

    }
  }
  validateSmartTable(event) {
    // reference ranges
    if (event['newData'].physiology) {
      if (!event['newData'].physiology) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione un Tipo Fisiológico');
        return false;
      } else if (!event['newData'].literal) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione una Unidad');
        return false;
      } else if (!event['newData'].startRangeUnit) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Periodo Inicial');
        return false;
      } else if (!event['newData'].endRangeUnit) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Periodo Final');
        return false;
      } else if (event['newData'].startRangeUnit < 0) {
        this.toastService.showToast('warning', 'Error de validación', 'Periodo Inicial no puede ser menor a 1');
        return false;
      } else if (event['newData'].endRangeUnit < 0) {
        this.toastService.showToast('warning', 'Error de validación', 'Periodo Final no puede ser menor a 1');
        return false;
      } else if (event['newData'].startRangeUnit > event['newData'].endRangeUnit) {
        this.toastService.showToast('warning', 'Error de validación', 'Periodo Final no puede ser menor a Periodo Inicial');
        return false;
      } else if (!event['newData'].low) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Normal Inferior');
        return false;
      } else if (!event['newData'].high) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Normal Superior');
        return false;
      } else if (event['newData'].low > event['newData'].high) {
        this.toastService.showToast('warning', 'Error de validación', 'Normal Superior no puede ser menor a Normal Inferior');
        return false;
      } else if (event['newData'].panicLow || event['newData'].panicHigh) {
        if (!event['newData'].panicLow) {
          this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Pánico Inferior');
          return false;
        } else if (!event['newData'].panicHigh) {
          this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Pánico Superior');
          return false;
        } else if (event['newData'].panicLow > event['newData'].panicHigh) {
          this.toastService.showToast('warning', 'Error de validación', 'Pánico Superior no puede ser menor a Pánico Inferior');
          return false;
        }
      }
      return true;
    } else {
      // formulas
      if (!event['newData'].testId) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione algún Examen');
        return false;
      }
      return true;
    }
  }

  validateForm() {
    if (this.getData['test']) {
      if (!this.testContentForm.code) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Código');
        return false;
      } else if (!this.testContentForm.abbreviation) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Abreviatura');
        return false;
      } else if (!this.testContentForm.description) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Descripción');
        return false;
      } else if (!this.testVersionContentForm.tubeId) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione un Contenedor');
        return false;
      } else if (!this.testVersionContentForm.primaryUnit) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione una Unidad');
        return false;
      }
      return true;
    } else {
      if (!this.testContentForm.code) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese un Código');
        return false;
      } else if (!this.testContentForm.abbreviation) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Abreviatura');
        return false;
      } else if (!this.testContentForm.description) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese una Descripción');
        return false;
      } else if (!this.testVersionContentForm.tubeId) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione un Contenedor');
        return false;
      } else if (!this.testVersionContentForm.primaryUnit) {
        this.toastService.showToast('warning', 'Dato Incompleto', 'Seleccione una Unidad');
        return false;
      } else {
        const testCode = this.getData['allTests'].find((dem) => dem.code === this.testContentForm.code);
        if (testCode) {
          this.toastService.showToast(
            'warning',
            'Error de validación',
            `El Código "${this.testContentForm.code}" ya se encuentra registrado!`
          );
          return false;
        }
        return true;
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
  // ranges tab
  ranges = [];
  rangeSource: LocalDataSource;
  rangeTableSettings = {
    actions: {
      position: 'right',
      columnTitle: 'Acción',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmDelete: true,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    columns: {
      physiology: {
        title: 'Tipo Fisiológico',
        filter: false,
        defaultValue: 'otro',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [
              { value: 'masculino', title: 'Masculino' },
              { value: 'femenino', title: 'Femenino' },
              { value: 'otro', title: 'Otro' },
            ],
          },
        },
      },
      literal: {
        title: 'Unidad',
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [
              { value: 'dias', title: 'Días' },
              { value: 'semanas', title: 'Semanas' },
              { value: 'meses', title: 'Meses' },
              { value: 'años', title: 'Años' },
            ],
          },
        },
      },
      startRangeUnit: {
        title: 'Periodo Ini.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
      endRangeUnit: {
        title: 'Periodo Fin.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
      low: {
        title: 'Normal Inf.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
      high: {
        title: 'Normal Sup.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
      panicLow: {
        title: 'Valor Crítico Inf.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
      panicHigh: {
        title: 'Valor Crítico Sup.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
      alertLow: {
        title: 'Alerta Inf.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
      alertHigh: {
        title: 'Alerta Sup.',
        type: 'number',
        editable: true,
        filter: false,
        addable: true,
        editor: {
          type: 'custom',
          component: InputNumberComponent,
        },
      },
    },
  };

  // formula tab
  disabledFormula = false;
  variable: { variable: string, test: number; };
  formulas: TestFormula[] = [];
  showFormulaTable = false;
  formulaSource: LocalDataSource;
  formulaTableSettings = {
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      add: false,
      delete: false,
      width: '10%',
    },
    noDataMessage: 'Sin Variables asociadas',
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmDelete: true,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    columns: {
      variableName: {
        title: 'Variable',
        type: 'string',
        editable: false,
        filter: false,
        width: '45%',
      },
      testId: {
        width: '45%',
        title: 'Examen',
        valuePrepareFunction: (data) => {
          let testDesc = 'Seleccione un Examen';
          const foundedTest = this.test.find(t => t.id === Number(data));
          if (foundedTest) {
            testDesc = foundedTest.description;
          }

          return testDesc;
        },
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [],
          },
        },
      },
    },
  };

}
