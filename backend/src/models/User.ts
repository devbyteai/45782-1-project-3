import { AllowNull, AutoIncrement, Column, DataType, Default, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import Like from "./Like";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Table({
    underscored: true,
    tableName: 'users'
})
export default class User extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    first_name: string

    @AllowNull(false)
    @Column(DataType.STRING)
    last_name: string

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    email: string

    @AllowNull(false)
    @Column(DataType.STRING)
    password: string

    @AllowNull(false)
    @Default(UserRole.USER)
    @Column(DataType.ENUM(...Object.values(UserRole)))
    role: UserRole

    @HasMany(() => Like, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    likes: Like[]

}
