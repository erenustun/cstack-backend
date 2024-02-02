import { Role } from '@shared/enum/user/role.enum'

export const userMock: any[] = [
  {
    id: '1b6a7084-3c74-4975-af8f-6a268aff6116',
    firstName: 'Osbourne',
    lastName: 'Greggersen',
    username: 'ogreggersen1',
    avatar:
      'https://robohash.org/omnisconsequaturdolor.png?size=50x50&set=set1',
    email: 'Albertha.Ernser51@gmail.com',
    password: '$2b$10$vEt2l5brYJF0C8g2puZRIuNeb5l06G/GqBtg4ELBwI.s/AX.YTeEa',
    role: Role.PRODUCT_MANAGEMENT,
    phone: '+41 76 451 44 84',
  },
  {
    id: '1cdefcb4-edb2-4365-925d-4ebcb7b5f185',
    firstName: 'Torre',
    lastName: 'Veldman',
    username: 'tveldman2',
    avatar: 'https://robohash.org/quodsapienteeveniet.png?size=50x50&set=set1',
    email: 'Eliza_Halvorson@gmail.com',
    password: '$2a$10$.cS5/dw9G0boJzgbGpx50.ZskG0yTx.OUiSQX1kfOabm39GD/RH.S',
    role: Role.ADMIN,
    phone: '+41 76 524 41 13',
  },
  {
    id: 'f6eef4f4-d904-4b61-8012-2c7c2792c1bb',
    firstName: 'Gast',
    lastName: 'Mustermann',
    username: 'mustermann12',
    avatar: 'https://robohash.org/autundedistinctio.png?size=50x50&set=set1',
    email: 'customer@webstorehub.io',
    password: '$2b$10$vEt2l5brYJF0C8g2puZRIuNeb5l06G/GqBtg4ELBwI.s/AX.YTeEa',
    role: Role.CUSTOMER,
    phone: '+41 76 474 59 05',
  },
]
