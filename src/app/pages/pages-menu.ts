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
    title: 'Alumnos',
    icon: 'radio-button-off-outline',
    link: '/pages/core/alumn',
  },
  {
    title: 'Objetivos de aprendizaje',
    icon: 'radio-button-off-outline',
    link: '/pages/core/objective',
  },
  {
    title: 'CONFIGURACIÓN',
    group: true,
  },
  // {
  //   title: 'Turnos',
  //   link: '/pages/configuration/turn',
  // },
  {
    title: 'Sistema',
    icon: 'cube-outline',
    children: [

      {
        title: 'Usuarios',
        icon: 'people-outline',
        children: [
          {
            title: 'Usuarios',
            link: '/pages/administration/user',
          },

        ],
      },
      {
        title: 'Parámetros',
        link: '/pages/administration/system-parameters',
        icon: 'lock-outline',
      },
    ],
  },
];
