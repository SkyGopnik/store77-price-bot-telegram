import LinkInfoModel from "@models/link.info.model";
import {
  Table,
  Column,
  Model,
  HasMany
} from 'sequelize-typescript';

@Table({tableName: 'Link'})
export default class LinkModel extends Model {

  @Column
  chatId: string;

  @Column
  link: string;

  @Column
  name: string;

  @Column
  image: string;

  @HasMany(() => LinkInfoModel, 'linkId')
  info: LinkInfoModel[];

}
