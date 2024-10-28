export default class APIFeatures {
  constructor(sqlQuery, queryObj) {
    this.sqlQuery = sqlQuery;
    this.queryObj = queryObj;
  }

  //Advanced filtering
  filter() {
    const queryObjClone = { ...this.queryObj };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObjClone[el]);

    let queryStr = JSON.stringify(queryObjClone);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.sqlQuery = this.sqlQuery.find(JSON.parse(queryStr));

    return this;
  }

  paginate() {
    let page = parseInt(this.queryObj.page) || 1;
    let limit = parseInt(this.queryObj.limit) || 10;

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 100;

    const skip = (page - 1) * limit;

    this.sqlQuery = this.sqlQuery.skip(skip).limit(limit);

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(",").join(" ");
      this.sqlQuery = this.sqlQuery.sort(sortBy);
    } else {
      this.sqlQuery = this.sqlQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(",").join(" ");
      this.sqlQuery = this.sqlQuery.select(fields);
    }

    return this;
  }
}
