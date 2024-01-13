require('dotenv').config() 
console.log(process.env.notion_secret)
console.log(process.env.database_id)

console.log()




url = "https://api.notion.com/v1/pages"
options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${notion_secret}`,
        'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
        parent:{
            type: "database_id",
            database_id: "",
        },
        properties:{
            "Name":{
                type: "title",
                title: [
                    {
                        type: "text",
                        text: {
                            content: "Tomatoes"
                        }
                    }
                ]
            }
        }
    })
}

fetch(url, options)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))