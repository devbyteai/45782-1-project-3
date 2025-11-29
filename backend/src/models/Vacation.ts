import { AllowNull, AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Like from "./Like";

@Table({
    underscored: true,
    tableName: 'vacations'
})
export default class Vacation extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    destination: string

    @AllowNull(false)
    @Column(DataType.TEXT)
    description: string

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    start_date: Date

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    end_date: Date

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    price: number

    @AllowNull(false)
    @Column(DataType.STRING)
    image_filename: string

    @HasMany(() => Like, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    likes: Like[]

}
