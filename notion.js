/* 
	Get the tagged topics for a question on leetcode via graphql
	required usage on command line $node notion.js https://leetcode.com/~~~
*/
function getTags(){
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


	return fetch(url, options)
		.then(response => {
			if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
			return response.json();
		})
		.then((data) => {
			data = data["data"]["question"]["topicTags"]
			data = data.map(k => k['name'])
			console.log(data)
			return data
		})
		.catch(error => console.error('Error:', error));
}







getTags().then(tags => console.log(tags))
