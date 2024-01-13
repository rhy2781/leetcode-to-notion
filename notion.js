require('dotenv').config() 

const graphql = 'https://leetcode.com/graphql';
const url = process.argv[2]
const problemSlug = process.argv[2].split("/")[4]
const notion_url = 'https://api.notion.com/v1/pages'


/* 
	Get the tagged topics for a question on leetcode via graphql
	required usage on command line $node notion.js https://leetcode.com/~~~

	[topic, topic1, topic2, topic3, ... ]
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
	{
		title: "....",
		number: ...
	}
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

/*
	Submit request via notion api to create a page within my personal database
*/
function createNotionPage(tags, questionTitle){
	var ms = []
	tags.forEach(element => {
		ms.push({name: element})
	});


	options = {
    	method: 'POST',
    	headers: {
        	'Content-Type': 'application/json',
        	'Authorization': `Bearer ${process.env.notion_secret}`,
        	'Notion-Version': '2022-06-28'
    	},
    	body: JSON.stringify({
        	parent:{
            	type: "database_id",
            	database_id: process.env.database_id,
        	},
        	properties:{
            	"Name":{
                	type: "title",
                		title: [{
                        	type: "text",
                        	text: {
                            	content: `${questionTitle["number"]}. ${questionTitle["title"]}`
							}
                    	}]
            		},
				"Tags":{
					type : "multi_select",
					multi_select: ms
					// multi_select : {
					// 	options: ms
					// }
				}
			}
    	})
	}

	fetch(notion_url, options)
	    .then(res => res.json())
	    .then(data => console.log(data))
	    .catch(err => console.log(err))

}



async function main(){
	const tags = await getTags()
	const questionTitle = await getQuestionTitle()\
	const res = await createNotionPage(tags, questionTitle)
}

main()