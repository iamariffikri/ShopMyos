export default class Health {
  public static perform(req, res): any {
    return res.json({
      message: 'Well and healty',
    })
  }
}
