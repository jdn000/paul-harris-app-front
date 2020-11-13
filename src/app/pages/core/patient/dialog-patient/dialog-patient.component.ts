import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Turn } from '../../../../models/turn';
import { CustomerCenter } from '../../../../models/customer';
import { Demographic, DemographicItems } from '../../../../models/demographic';
import { Patient } from '../../../../models/patient';
import { CustomerService } from '../../../../services/customer.service';
import { DemographicService } from '../../../../services/demographic.service';
import { PatientService } from '../../../../services/patient.service';
import { ToastService } from '../../../../services/toast.service';
import { TurnService } from '../../../../services/turn.service';

@Component({
  selector: 'ngx-dialog-patient',
  templateUrl: './dialog-patient.component.html',
  styleUrls: ['./dialog-patient.component.scss']
})
export class DialogPatientComponent implements OnInit {
  patientData: Patient;
  patients: Patient[];
  patientDemographics: Demographic[];
  filteredPDFree: Demographic[] = [];
  filteredPDCoded: Demographic[] = [];
  filteredPDItems: DemographicItems[] = [];
  filteredFreeDemographics: Demographic[] = [];
  filteredCodedDemographics: Demographic[] = [];
  filteredDemographicItems: DemographicItems[] = [];
  buttonTitle: string;
  title: string;
  loading = false;
  disabledTurnSelect = true;
  turnLoader = false;
  submited = false;
  cCenter: CustomerCenter = {} as CustomerCenter;
  turns: Turn[] = [];
  selectedCCenter: CustomerCenter = {} as CustomerCenter;
  selectedTurn: Turn = {} as Turn;
  customerCenters: CustomerCenter[];
  freeDemographicsToInsert: Demographic[] = [];
  codedDemos: {
    description: string,
    demographicsForChoose: DemographicItems[],
    selectedDemoItem: DemographicItems,
    allDemoItem: DemographicItems[];
  }[] = [];
  loadingDemos = false;

  customerCtrl: FormControl;
  filteredCustomer: Observable<any[]>;

  constructor(
    private readonly dialogRef: MatDialogRef<DialogPatientComponent>,
    private readonly toastService: ToastService,
    public readonly demographicService: DemographicService,
    public readonly patientService: PatientService,
    public readonly customerCenterService: CustomerService,
    public readonly turnService: TurnService,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      patientId: number,
      patients: Patient[],
      buttonTitle: string,
      title: string,
      patientData: Patient;
      patientDemographics: Demographic[];
      customerCenters: CustomerCenter[];
    }
  ) { }
  async ngOnInit() {
    this.customerCtrl = new FormControl();



    this.loading = true;
    this.patientData = this.dialogData.patientData;
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.patients = this.dialogData.patients;
    this.patientDemographics = this.dialogData.patientDemographics;
    this.patientData.userId = this.patientData.id ? this.patientData.userId : 1;
    this.loadingDemos = true;
    this.disabledTurnSelect = true;

    if (this.patientData.id) {
      await this.getPatientInfo();
    } else {
      this.patientData.demographics = [];
      this.patientData.turnId = null;
      this.patientData.customerCenterId = null;
      this.customerCenters = this.dialogData.customerCenters;
      await this.demographicsCheckerNewPatient();
    }
    this.filteredCustomer = this.customerCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        map(patient => patient ? this.filterPatients(patient) : this.customerCenters.slice())
      );
    this.loading = false;
    this.loadingDemos = false;
  }
  timeConvert(hour) {
    let timeString = hour;
    const H = +timeString.substr(0, 2);
    const h = (H % 12) || 12;
    const ampm = H < 12 ? 'AM' : 'PM';
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }
  filterPatients(name: string) {
    const filterValue = name.toLowerCase();
    return this.customerCenters.filter(
      customer => String(customer.code).toLowerCase().indexOf(filterValue) > -1 ||
        String(customer.description).toLowerCase().indexOf(filterValue) > -1);
  }
  onEnterFilterCustomer(evt: any) {
    if (evt.source) {
      this.selectedCCenter = this.customerCenters.find((rl) => rl.code === evt.source.value);
      this.onSelectedCustomerCenter(this.selectedCCenter);
    } else if (this.customerCenters.find((rl) => rl.code === evt.srcElement.value)) {
      this.selectedCCenter = this.customerCenters.find((rl) => rl.code === evt.srcElement.value);
      this.onSelectedCustomerCenter(this.selectedCCenter);
    } else {
      this.toastService.showToast('warning', 'Dato Incompleto', `No se encontró Centro de diálisis ${this.cCenter.code}`);
    }
  }


  async getPatientInfo() {
    this.patientData = (await this.patientService.getById(this.patientData.id).toPromise()).data;
    await this.demographicsChecker();
    if (this.patientData.customerCenterId) {
      this.turnLoader = true;
      this.selectedCCenter = (await this.customerCenterService.getById(this.patientData.customerCenterId).toPromise()).data;
      if (this.selectedCCenter.turns) {
        this.turns = await Promise.all(this.selectedCCenter.turns.map(async (turn) => {
          const t = (await this.turnService.getById(turn).toPromise()).data;
          return t;
        }));
        this.turns.forEach((turn) => {
          turn.startHour = this.timeConvert(turn.startHour);
          turn.endHour = this.timeConvert(turn.endHour);
        });
        this.turnLoader = false;
      }
      if (this.patientData.turnId) {
        this.selectedTurn = (await this.turnService.getById(this.patientData.turnId).toPromise()).data;
        this.turns = this.turns.filter((cc) => cc.id !== this.selectedTurn.id);
        this.disabledTurnSelect = false;
      }
    }
    this.customerCenters = this.dialogData.customerCenters;

    if (this.selectedCCenter) {
      this.customerCtrl.setValue(this.selectedCCenter.code);
    }
    this.turnLoader = false;
  }

  async onKeySearch(event: any, demographic: any) {
    const newFreeDemo: Demographic = {
      id: demographic.id, userId: 1, value: event.target.value
    };
    this.upsertFreeDemographic(newFreeDemo);
  }
  public upsertFreeDemographic(demographic: Demographic) {
    const founded = this.freeDemographicsToInsert.find((fdt) => fdt.id === demographic.id);
    if (founded) {
      founded.value = demographic.value;
    } else {
      this.freeDemographicsToInsert.push(demographic);
    }
  }
  async onSelectedCustomerCenter(center: CustomerCenter) {
    try {
      this.disabledTurnSelect = true;
      this.turnLoader = true;
      this.selectedTurn = {} as Turn;
      this.selectedCCenter = (await this.customerCenterService.getById(center.id).toPromise()).data;
      if (this.selectedCCenter.turns) {
        this.turns = await Promise.all(this.selectedCCenter.turns.map(async (turn) => {
          const t = (await this.turnService.getById(turn).toPromise()).data;
          return t;
        }));
        this.turns.forEach((turn) => {
          turn.startHour = this.timeConvert(turn.startHour);
            turn.endHour = this.timeConvert(turn.endHour);
        });
        this.turns = this.turns.filter((cc) => cc.id !== this.selectedTurn.id);
        this.turnLoader = false;
      }
      this.patientData.customerCenterId = this.selectedCCenter.id;
      this.disabledTurnSelect = false;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  async onSelectedTurn(evt: any) {
    try {
      this.selectedTurn = evt.value;
      this.patientData.turnId = evt.value.id;
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  async attachCodedDemographic(evt: any) {
    try {
      this.patientData.demographics.push({
        id: evt.value.demographicId,
        userId: this.patientData.userId,
        itemId: evt.value.id,
        value: evt.value.description
      });
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }

  async managePatient() {
    try {
      this.submited = true;
      if (this.validateForm()) {
        this.demographicsToInsert();
        if (this.patientData.id) {
          const patientId = this.patientData.id;
          delete this.patientData.id;
          await this.patientService.update(patientId, this.patientData).toPromise();
        } else {
          // this.patientData.userId = JSON.parse(localStorage.getItem('user')).id;
          this.patientData.userId = 1;
          await this.patientService.add(this.patientData).toPromise();
        }
        this.dialogRef.close(this.patientData);
      }
    } catch (error) {
      this.submited = false;
      this.toastService.showError(error.message || error);
    }
  }
  async demographicsToInsert() {
    if (this.freeDemographicsToInsert.length) {
      this.patientData.demographics.push(... this.freeDemographicsToInsert);
    }
  }
  async demographicsChecker() {
    this.loading = true;
    const allPatientData = (await this.patientService.getById(this.patientData.id).toPromise()).data;
    const activePatientDemos = allPatientData.demographics.filter((d) => d.status === true);
    this.patientData.demographics = activePatientDemos;
    this.patientDemographics.forEach(async (pd) => {
      let hasDemos = false;
      if (this.patientData.demographics && this.patientData.demographics.find((p) => p.id === pd.id)) {
        hasDemos = true;
      } else {
        hasDemos = false;
      }
      if (!hasDemos && pd.type === 'FREE' && pd.status) {
        this.filteredFreeDemographics.push(pd);
      } else if ((!hasDemos && pd.type === 'CODED' && pd.status)) {
        pd.items = (await this.demographicService.getDemographicItems(pd.id).toPromise()).data;
        this.filteredCodedDemographics.push(pd);
      } else if (hasDemos && pd.type === 'CODED' && pd.status) {
        pd.items = (await this.demographicService.getDemographicItems(pd.id).toPromise()).data;
        this.filteredPDCoded.push(pd);
        const selectedDem = this.patientData.demographics.find((d) => d.id === pd.id);
        const selectedItem = pd.items.find((n) => n.id === selectedDem.itemId);
        const separatedItems = pd.items.filter((n) => n.id !== selectedDem.itemId);
        this.codedDemos.push({
          description: pd.description,
          demographicsForChoose: separatedItems,
          selectedDemoItem: selectedItem,
          allDemoItem: pd.items
        });
      } else if (hasDemos && pd.type === 'FREE' && pd.status) {
        this.filteredPDFree.push(pd);
      }
    });
    this.loading = false;
  }
  async demographicsCheckerNewPatient() {
    this.loading = true;
    this.patientDemographics.forEach(async (pd) => {
      if (pd.type === 'FREE' && pd.status) {
        this.filteredFreeDemographics.push(pd);
      } else if (pd.type === 'CODED' && pd.status) {
        pd.items = (await this.demographicService.getDemographicItems(pd.id).toPromise()).data;
        this.filteredCodedDemographics.push(pd);
      }
    });
    this.loading = false;
  }
  ageFromBirthdate(dateOfBirth: any): number {
    const now = new Date();
    const bd = new Date(dateOfBirth);
    let patientAge = now.getFullYear() - bd.getFullYear();
    const m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) {
      patientAge--;
    }
    this.patientData.age = patientAge;
    return patientAge;
  }
  async onSelectedDemographics(evt: any, demo: any, demosForChoose: any) {
    try {
      this.patientData.demographics.forEach((k) => {
        if (k.id === demo.demographicId && k.itemId !== demo.id) {
          k.itemId = evt.value.id;
          k.value = evt.value.description;
          demosForChoose.demographicsForChoose = demosForChoose.allDemoItem.filter((i) => i.id !== demo.id);
          demosForChoose.selectedDemoItem = demo;
        }
      });
    } catch (error) {
      this.toastService.showError(error.message || error);
    }
  }
  validateForm() {
    if (!this.patientData.patientId) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese rut de paciente');
      this.submited = false;
      return false;
    }
    if (!this.patientData.firstName) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese nombre ');
      this.submited = false;
      return false;
    }
    if (!this.patientData.lastName) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese apellido paterno');
      this.submited = false;
      return false;
    }
    if (!this.patientData.secondSurname) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese apellido materno');
      this.submited = false;
      return false;
    }
    if (!this.patientData.sex) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese sexo');
      this.submited = false;
      return false;
    }
    if (!this.patientData.birthdate) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese fecha de nacimiento');
      this.submited = false;
      return false;
    }
    if (this.patientData.age === undefined || this.patientData.age < 0) {
      this.toastService.showToast('warning', 'Dato Incompleto', 'Ingrese edad');
      this.submited = false;
      return false;
    }
    if (!this.patientData.id) {
      const patientId = this.dialogData.patients.find((patient) => patient.patientId === this.patientData.patientId);
      if (patientId) {
        this.toastService.showToast(
          'warning',
          'Error de validación',
          'El rut "' + this.patientData.patientId + '" ya se encuentra registrado!'
        );
        this.submited = false;
        return false;
      }
    }
    this.submited = true;
    return true;
  }

}
