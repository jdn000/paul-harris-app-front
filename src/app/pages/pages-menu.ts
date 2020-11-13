import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'MÓDULOS',
    group: true
  },
  {
    title: 'Pre-Análisis',
    icon: 'radio-button-off-outline',
    children: [
      {
        title: 'Atenciones',
        icon: 'list-outline',
        link: '/pages/core/order',
      },
      {
        title: 'Recepción',
        icon: 'shopping-bag-outline',
        link: '/pages/core/reception',
      },
      {
        title: 'Nóminas',
        icon: 'shield-outline',
        link: '/pages/core/workload',
      },
      {
        title: 'Pacientes',
        icon: 'person-outline',
        link: '/pages/core/patient',
      },
    ]
  },
  {
    title: 'Análisis',
    icon: 'radio-button-on-outline',
    children: [
      {
        title: 'Resultados',
        icon: 'book-outline',
        link: '/pages/core/result',
      },
      {
        title: 'Validación',
        icon: 'checkmark-circle-2-outline',
        link: '/pages/core/validation',
      },
    ]
  },
  {
    title: 'Post-Análisis',
    icon: 'loader-outline',
    children: [
      {
        title: 'Informes',
        icon: 'cloud-download-outline',
      },
    ]
  },
  {
    title: 'CONFIGURACIÓN',
    group: true,
  },
  {
    title: 'Laboratorio',
    icon: 'bookmark-outline',
    children: [
      {
        title: 'Exámenes',
        icon: 'funnel-outline',
        link: '/pages/configuration/test',
      },
      {
        title: 'Perfiles',
        icon: 'layers-outline',
        link: '/pages/configuration/profile',
      },
      {
        title: 'Contenedores',
        icon: 'color-picker-outline',
        link: '/pages/configuration/tube',
      },
      {
        title: 'Muestras',
        icon: 'droplet-outline',
        link: '/pages/configuration/specimen',
      },
      {
        title: 'Microbiología',
        icon: 'pantone-outline',
        children: [
          {
            title: 'Antibióticos',
          },
          {
            title: 'Microorganismos',
          },
          {
            title: 'Antibiogramas',
          },
        ],
      },
    ],
  },
  {
    title: 'Sistema',
    icon: 'cube-outline',
    children: [
      {
        title: 'Clientes',
        icon: 'briefcase-outline',
        children: [
          {
            title: 'Centros de Diálisis',
            link: '/pages/configuration/customer-center',
          },
          {
            title: 'Turnos',
            link: '/pages/configuration/turn',
          },
        ],
      },
      {
        title: 'Atenciones',
        icon: 'options-2-outline',
        children: [
          {
            title: 'ID Atención',
            link: '/pages/configuration/order',

          },
          {
            title: 'Demográficos',
            link: '/pages/configuration/demographic',
          },
        ],
      },
      {
        title: 'Usuarios',
        icon: 'people-outline',
        children: [
          {
            title: 'Usuarios',
            link: '/pages/administration/user',
          },
          {
            title: 'Roles',
            link: '/pages/administration/role',
          },
        ],
      },
      {
        title: 'Etiquetas',
        icon: 'npm-outline',
        link: '/pages/administration/label',
      },
      {
        title: 'Impresoras',
        icon: 'printer-outline',
        link: '/pages/administration/printer',
      },
      {
        title: 'Parámetros',
        link: '/pages/administration/system-parameters',
        icon: 'lock-outline',
      },
    ],
  },
];
