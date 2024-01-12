var url = 'https://leetcode.com/graphql';
var operationName = 'singleQuestionTopicTags';
var query = `
      query singleQuestionTopicTags($titleSlug:String!){
          question(titleSlug:$titleSlug){
              topicTags{
                  name
                  slug
              }
          }
      }
  `
var problemSlug = process.argv[2].split("/")[4]

var options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		operationName: operationName,
		query: query,
		variables: {
			titleSlug: problemSlug
		}
	})
}


fetch(url, options)
	.then(response => {
		if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
		return response.json();
	})
	.then((data) => {
		response = data["data"]
		console.log(response["question"]["topicTags"])
	})
	.catch(error => console.error('Error:', error));

