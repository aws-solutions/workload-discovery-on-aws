curl -d '{
       "command": "index",
       "data": {
         "id" : "1234",
         "label" : "test",
         "properties": "test"
       }
     }' -H "Content-Type: application/json" -X POST https://a7xh4spiu8.execute-api.us-east-2.amazonaws.com/dev/search/ 
