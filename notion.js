
var url = 'https://leetcode.com/graphql';
var operationName = 'singleQuestionTopicTags';
var s = 'check-if-n-and-its-double-exist';

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


var options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		operationName: operationName,
		query: query,
		variables: {
			titleSlug: "add-two-numbers"
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

