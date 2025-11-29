import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./User";
import Vacation from "./Vacation";

@Table({
    underscored: true,
    tableName: 'likes',
    timestamps: false
})
export default class Like extends Model {

    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    user_id: number

    @PrimaryKey
    @ForeignKey(() => Vacation)
    @Column(DataType.INTEGER)
    vacation_id: number

    @BelongsTo(() => User)
    user: User

    @BelongsTo(() => Vacation)
    vacation: Vacation

}
