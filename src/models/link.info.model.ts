import {
  Table,
  Model,
  BelongsTo, Column
} from 'sequelize-typescript';

import LinkModel from "@models/link.model";

@Table({tableName: 'LinkInfo'})
export default class LinkInfoModel extends Model {

  @Column
  price: number;

  @BelongsTo(() => LinkModel, {foreignKey: 'linkId', onDelete: 'cascade'})
  link: LinkModel;

}
