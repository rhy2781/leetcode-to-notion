const graphql = 'https://leetcode.com/graphql';
const url = process.argv[2]
const problemSlug = process.argv[2].split("/")[4]

/* 
	Get the tagged topics for a question on leetcode via graphql
	required usage on command line $node notion.js https://leetcode.com/~~~
*/
function getTags(){
	var operationName = 'singleQuestionTopicTags';
	var query = `
		query ${operationName}($titleSlug:String!){
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
				titleSlug: problemSlug
			}
		})
	}

	return fetch(graphql, options)
		.then(response => {
			if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
			return response.json();
		})
		.then((data) => {
			data = data["data"]["question"]["topicTags"]
			data = data.map(k => k['name'])
			return data
		})
		.catch(error => console.error('Error:', error));
}

/*
	Get the question title and number to use for database and page creation entry
*/
function getQuestionTitle(){
	var operationName = 'questionTitle';
	var query = `
		query ${operationName}($titleSlug:String!){
			question(titleSlug:$titleSlug){
				questionId
				questionFrontendId
				title
				titleSlug
				isPaidOnly
				difficulty
				likes
				dislikes
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
				titleSlug: problemSlug
			}
		})
	}

	return fetch(graphql, options)
		.then(response => {
			if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
			return response.json();
		})
		.then((data) => {
			data = data["data"]

			const res = {}
			res.title = data["question"]["title"]
			res.number = data["question"]["questionFrontendId"]
			return res
		})
		.catch(error => console.error('Error:', error));
}



getTags().then(tags => console.log(tags))
getQuestionTitle().then(res => console.log(res))
