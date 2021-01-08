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
    icon: 'bulb-outline',
    link: '/pages/core/alumn',
  },
  {
    title: 'Objetivos de aprendizaje',
    icon: 'book-open-outline',
    link: '/pages/core/objective',
  },
  {
    title: 'Notas',
    icon: 'grid-outline',
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
    icon: 'npm-outline',
    link: '/pages/core/report',
  },
  {
    title: 'Resultados',
    icon: 'trending-up-outline',
    link: '/pages/core/result',
  },
  {
    title: 'Mi Curso',
    icon: 'people-outline',
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
    icon: 'settings-outline',
    children: [
      {
        title: 'Usuarios',
        icon: 'person-outline',
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
        icon: 'award-outline',
      },
      {
        title: 'Cursos',
        link: '/pages/administration/grade',
        icon: 'book-outline',
      },
    ],
  },
];
