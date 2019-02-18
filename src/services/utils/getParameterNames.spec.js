const { getParameterNames } = require('./getParameterNames')
describe('getParameterNames', function() {
  class Test {
    async topicsOrderedByViewCount(order = OrderEnum.DESC) {
      const topics = await this.makeAnalyticEventQuery()
        .groupBy('topic_analytic_events.topic_id')
        .count()
        .orderBy('count', order)
        // TODO for now we know we always use this field with these populated, but it would be nice to contruct these dynamically depending on the GQL query
        .eager('topic.[currentTopicVersion, workspace]')
      return topics.map((topic) => {
        return new AnalyticsGQLClasses_1.AnalyticsViewCountByTopicModel({
          count: topic.count,
          topic: class_transformer_1.plainToClass(
            TopicModelAsEditor_1.default,
            topic.topic
          )
        })
      })
    }
  }

  it('should find only one arg', async () => {
    expect(getParameterNames(Test.prototype.topicsOrderedByViewCount))
      .toMatchInlineSnapshot(`
Array [
  "order",
]
`)
  })
})
