import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'username',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    name: 'full_name',
    nullable: true,
  })
  fullName: string;

  @Column({
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: 'country',
    nullable: false,
  })
  country: string;

  @Column({
    name: 'address_line',
    nullable: false,
  })
  addressLine: string;

  @Column({
    name: 'zip_code',
    nullable: false,
  })
  zipCode: string;

  @Column({
    name: 'city',
    nullable: false,
  })
  city: string;
}
