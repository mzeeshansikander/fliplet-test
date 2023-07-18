const { kv } = require("@vercel/kv");
const dotenv = require("dotenv");
const _ = require("lodash");
dotenv.config();

class User {
  constructor(query) {
    this.query = query;
    this.sampleData = null;
  }

  async loadData() {
    const sampleDataRedis = kv.get("sample_data");
    this.sampleData = await sampleDataRedis;
  }

  select(entity) {
    this.entity = entity;
    return this;
  }

  attributes(attrList) {
    this.attrList = attrList;
    return this;
  }

  where(conditions) {
    this.conditions = conditions;
    return this;
  }

  order(orderBy) {
    this.orderBy = orderBy;
    return this;
  }

  limit(limit) {
    this.limitBy = limit;
    return this;
  }

  findAll() {
    const selectedData = this.sampleData[this.entity];
    if (!selectedData) return null;
    const filteredData = _.filter(selectedData, this.conditions);
    const sortedData = _.orderBy(filteredData, this.orderBy);
    const limitedData = this.limitBy
      ? _.take(sortedData, this.limitBy)
      : sortedData;
    return _.map(limitedData, (item) => _.pick(item, this.attrList));
  }

  findOne() {
    const selectedData = this.sampleData[this.entity];
    if (!selectedData) return null;
    return (
      _.chain(selectedData)
        .filter(this.conditions)
        .map((item) => _.pick(item, this.attrList))
        .first()
        .value() || null
    );
  }
}

var user = new User({
  id: 123,
});

user
  /* 
  Must run loadData() before any other methods 
  followed by a .then() to make sure that the data is loaded from KV
  */
  .loadData()
  .then(() =>
    console.log(
      user
        .select("apps")
        .attributes(["id", "title", "userId"])
        .limit(3)
        .where({ published: true })
        .findAll()
    )
  );
