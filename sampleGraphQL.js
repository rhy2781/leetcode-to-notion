var url = 'https://leetcode.com/graphql';

var query = `
  query {
    matchedUser(username: "roberty579") {
      username
      submitStats: submitStatsGlobal{
        acSubmissionNum{
            difficulty
            count
            submissions
        }
      }
    }
  }
`;

var options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: query }),
};

fetch(url, options)
  .then(function(response) {
    if (!response.ok) {
      throw new Error('HTTP error! Status: ' + response.status);
    }
    return response.json();
  })
  .then((data) =>{
    const responseData = data['data']
    console.log(responseData['matchedUser'])

    const submitStats = responseData['matchedUser']['submitStats'];

    // Log the entire submitStats object
    console.log(submitStats);

  })
  .catch((error) => {
    console.error('Error:', error);
  });
