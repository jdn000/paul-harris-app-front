import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import { ToastService } from '../../../services/toast.service';
import { DialogPatientComponent } from './dialog-patient/dialog-patient.component';
import * as moment from 'moment';
import { Turn } from '../../../models/turn';
import { CustomerCenter } from '../../../models/customer';
import { CustomerService } from '../../../services/customer.service';
import { TurnService } from '../../../services/turn.service';
import { DemographicService } from '../../../services/demographic.service';
import { Demographic } from '../../../models/demographic';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'ngx-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit, AfterViewInit {
  patients: Patient[] = [];
  patientData: Patient = {} as Patient;
  customerCenters: CustomerCenter[] = [];
  allCustomerCenters: CustomerCenter[] = [];
  centerData: CustomerCenter = {} as CustomerCenter;
  turns: Turn[] = [];
  turnId: number;
  queryString: string;
  cCenter: CustomerCenter = {} as CustomerCenter;
  loading = false;
  disabledTurnSelect = true;
  patientDemographics: Demographic[] = [];
  selectedCustomerAndPatient = false;
  redirect = {
    order: null,
    workloadId: null,
  };
  customerCtrl: FormControl;
  filteredCustomer: Observable<any[]>;

  constructor(
    public readonly patientService: PatientService,
    public readonly customerCenterService: CustomerService,
    public readonly turnService: TurnService,
    private readonly toastService: ToastService,
    public readonly dialog: MatDialog,
    public readonly demographicService: DemographicService,
    private readonly ngxService: NgxUiLoaderService,
    public router: Router,
  ) {
    if (typeof this.router.getCurrentNavigation().extras.state !== 'undefined') {
      this.redirect.workloadId = this.router.getCurrentNavigation().extras.state.id;
    }
  }

  async ngOnInit() {
    this.ngxService.startLoader('patient');
    await this.load();
    this.ngxService.stopLoader('patient');
  }
  @ViewChild('table') smartTable: Ng2SmartTableComponent;
  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((dataObject: any) => {
      this.patientData = dataObject.data;
      this.openDialog();
    });
    this.smartTable.create.subscribe(() => {
      const newPatient: Patient = {} as Patient;
      this.patientData = newPatient;
      this.openDialog();
    });
  }
  async load() {
    try {
      this.loading = true;
      this.customerCtrl = new FormControl();
      this.customerCtrl.setValue(this.cCenter.code);
      this.filteredCustomer = this.customerCtrl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(500),
          distinctUntilChanged(),
          map(patient => patient ? this.filterPatients(patient) : this.customerCenters.slice())
        );

      this.customerCenters = await this.customerCenterService.getActives().toPromise();
      this.allCustomerCenters = (await this.customerCenterService.getAll().toPromise()).data;
      this.patients = await this.patientService.getLast().toPromise();
      this.queryString = '';
      this.disabledTurnSelect = true;
      let pDemosFromDb = await this.demographicService.getByUse('patient').toPromise();
      pDemosFromDb = pDemosFromDb.status ? pDemosFromDb.data : [];
      pDemosFromDb = pDemosFromDb.filter((p) => p.status === true);
      this.patientDemographics = pDemosFromDb;
      this.loading = false;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  filterPatients(name: string) {
    const filterValue = name.toLowerCase();
    return this.customerCenters.filter(
      customer => String(customer.code).toLowerCase().indexOf(filterValue) > -1 ||
        String(customer.description).toLowerCase().indexOf(filterValue) > -1);
  }
  async getByPatientParams(queryField: string): Promise<Patient[]> {
    const resp = await this.patientService.getByRequestedParams({ searchQuery: queryField }).toPromise();
    return resp.status ? resp.data : [];
  }
  async getByPatientAndCustomerIdParams(queryField: string, customerId: number): Promise<Patient[]> {
    const resp = await this.patientService.getByRequestedParams({ searchQuery: queryField, customerCenterId: customerId }).toPromise();
    return resp.status ? resp.data : [];
  }
  async onEnterFilterPatient(evt: any) {
    try {
      this.loading = true;
      this.patients = await this.getByPatientParams(this.queryString);
      this.loading = false;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  onEnterFilterCustomer(evt: any) {
    if (evt.source) {
      this.cCenter = this.customerCenters.find((rl) => rl.code === evt.source.value);
      this.onSelectedCustomerCenter(this.cCenter.id);
    } else if (this.customerCenters.find((rl) => rl.code === evt.srcElement.value)) {
      this.cCenter = this.customerCenters.find((rl) => rl.code === evt.srcElement.value);
      this.onSelectedCustomerCenter(this.cCenter.id);
    } else {
      this.toastService.showToast('warning', 'Dato Incompleto', `No se encontró Centro de diálisis ${this.cCenter.code}`);
    }
  }

  async onSelectedCustomerCenter(id: number) {
    try {
      this.loading = true;
      this.disabledTurnSelect = true;
      this.turns = [];
      this.cCenter = (await this.customerCenterService.getById(id).toPromise()).data;
      const patientsBycCenter = await this.patientService.getByCustomerId(id).toPromise();
      this.patients = patientsBycCenter.status ? patientsBycCenter.data : [];
      if (this.cCenter.turns) {
        this.turns = await this.customerCenterService.getTurnsByCustomerId(this.cCenter.id).toPromise();
        this.turns.forEach((turn) => {
            turn.startHour = this.timeConvert(turn.startHour);
            turn.endHour = this.timeConvert(turn.endHour);
        });
        this.disabledTurnSelect = false;
      }
      this.loading = false;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  timeConvert(hour) {
    let timeString = hour;
    const H = +timeString.substr(0, 2);
    const h = (H % 12) || 12;
    const ampm = H < 12 ? 'AM' : 'PM';
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }
  async onSelectedTurn(evt: any) {
    try {
      this.loading = true;
      if (this.cCenter.turns) {
        this.turns = (await Promise.all(this.cCenter.turns.map(t => this.turnService.getById(t).toPromise()))).map(t => t.data);
        this.turns.forEach((turn) => {
          turn.startHour = this.timeConvert(turn.startHour);
          turn.endHour = this.timeConvert(turn.endHour);
        });

        const queryResults = [];
        for (const t of evt.value) {
          if (t) {
            const query = (await this.patientService.getByCustomerAndTurn(this.cCenter.id, t).toPromise()).data;
            queryResults.push(...query);
          }
        }
        this.patients = queryResults;
      }
      this.loading = false;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPatientComponent, {
      data: {
        patients: this.patients,
        patientId: this.patientData.id,
        patientData: this.patientData,
        customerCenters: this.customerCenters,
        title: this.patientData.id ? 'Actualizar Registro Paciente' : 'Nuevo Registro Paciente',
        buttonTitle: this.patientData.id ? 'GUARDAR' : 'CREAR',
        patientDemographics: this.patientDemographics
      },
      width: '60%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.toastService.showSuccess(`Guardado exitosamente`);
        this.disabledTurnSelect = false;
        await this.load();

      }
    });
  }

  redirectingWorkload() {
    const navigationExtras: NavigationExtras = {
      state: {
        id: this.redirect.workloadId,
        type: 'WORKLOAD',
      }
    };
    this.router.navigate(['pages/core/workload/new/'], navigationExtras);
  }

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'Acción',
      delete: false,
    },
    delete: {
      deleteButtonContent: '<i class="nb-locked"></i>',
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
      patientId: {
        title: 'Rut',
        type: 'string',
      },
      firstName: {
        title: 'Nombres',
        type: 'string'
      },
      lastName: {
        title: 'Apellidos',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          return row.lastName + ' ' + row.secondSurname ? row.secondSurname : ' ';
        },
      },
      sex: {
        title: 'Sexo',
        type: 'string',
        valuePrepareFunction: (cell) => {
          if (cell === 'Male' || cell === 'M' || cell === 'm') {
            return 'Masculino';
          } else if (cell === 'G') {
            return 'No Definido';
          } else {
            return 'Femenino';
          }
        },
      },
      birthdate: {
        title: 'Fecha de nacimiento',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          return moment((this.patients.find((p) => p.id === row.id).birthdate)).format('DD/MM/YYYY');
        },
      },
      id: {
        title: 'centro de diálisis',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          const center = this.allCustomerCenters.find((c) => c.id === row.customerCenterId);
          return center ? center.description : 'No asignado';
        },
      },
    },
  };

}
