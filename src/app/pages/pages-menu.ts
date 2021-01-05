import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Inicio',
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
    title: 'Notas',
    icon: 'radio-button-off-outline',
    link: '/pages/core/calification',
    // children: [
    //   {
    //     title: '5to ',
    //     icon: 'people-outline',
    //   },
    //   {
    //     title: '6to ',
    //     icon: 'people-outline',
    //   },
    //   {
    //     title: '7mo ',
    //     icon: 'people-outline',
    //   },
    //   {
    //     title: '8vo ',
    //     icon: 'people-outline',
    //   },
    // ],
  },
  {
    title: 'Informe De notas',
    icon: 'radio-button-off-outline',
    link: '/pages/core/report',
  },
  {
    title: 'Resultados',
    icon: 'radio-button-off-outline',
    link: '/pages/core/result',
  },
  {
    title: 'Mi Curso',
    icon: 'radio-button-off-outline',
    link: '/pages/core/my-grade',
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
        title: 'Configuración Semestre',
        link: '/pages/administration/semester',
        //icon: 'lock-outline',
      },
      // {
      //   title: 'Asignaturas',
      //   link: '/pages/administration/subject',
      //   icon: 'lock-outline',
      // },
    ],
  },
];
