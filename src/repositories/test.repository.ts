import {EntityRepository, Repository} from "typeorm";
import {Test} from "../models/default/test.entity";

@EntityRepository(Test)
export class TestRepository extends Repository<Test> {

}
