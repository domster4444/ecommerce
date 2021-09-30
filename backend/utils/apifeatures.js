//todo: query str is object that contains all keyword,price[lt],etc queries
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  //? search method
  search() {
    const keyword = this.queryStr.keyword
      ? // find even if key exists in middle of a word
        {
          name: { $regex: this.queryStr.keyword },
          $options: 'i',
        }
      : // empty if no result found
        {};
    this.query = this.query.find({ ...keyword });
    //returns itself(class) & used for getting all product
    return this;
  }
  //? filter method for category
  filter() {
    const queryCopy = { ...this.queryStr };
    //*remove some fields for category
    const removeFields = ['keyword', 'page', 'limit'];
    removeFields.forEach((key) => delete queryCopy[key]);

    //*Filter for price and rating
    console.log(queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    console.log(queryStr);
    return this;
  }
  pagination(resultPerPage) {
    // page : 1  2 3  5  6
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    //0 to skip in pg - 1
    //10 to skip in pg - 2
    //20 to skip in pg - 3
    //30 to skip in pg - 4
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
module.exports = ApiFeatures;
