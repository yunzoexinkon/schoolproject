import json
import boto3
from decimal import Decimal
from datetime import datetime

def get_item_count(table):
    response = table.scan(Select='COUNT')
    return response['Count']

def lambda_handler(event, context) :
    requestMethod = event['httpMethod']
    if requestMethod == 'POST' :
        dynamodb1 = boto3.resource('dynamodb')
        dynamodb2 = boto3.client('dynamodb')
        
        table_name = 'programvalue'
        table = dynamodb1.Table(table_name)
        
        item_count = get_item_count(table)
        
        response = dynamodb2.scan(
            TableName = table_name,
        )
        items = response.get('Items',[])
        
        data = json.loads(event['body'])
        
        airpressure = Decimal(str(data['Airpressure']))
        temperature = Decimal(str(data['Temperature']))
        orpvalue = Decimal(str(data['Orpvalue']))
        current_time = str(data['Nowtime'])
        items2 = items
        items2.sort(key=lambda x: int(x['ID']['S']), reverse=False)
        
        if item_count > 0 :
            date1 = datetime.strptime(items[0]['Timestamp']['S'], "%Y-%m-%d %H:%M:%S")
            date2 = datetime.strptime(current_time, "%Y-%m-%d %H:%M:%S")
            duration = date2 - date1
            if duration.days>=2 :
                oldest_item = items[0]
                oldest_item_timestamp = oldest_item['ID']['S']
                response = dynamodb2.delete_item(
                    TableName=table_name,
                    Key={'ID': {'S': oldest_item_timestamp}}
                )
        item_count = get_item_count(table)
        if item_count > 0 :
            items.sort(key=lambda x: int(x['ID']['S']), reverse=True)
            newest_item = items[0]
            newest_item_id = int(newest_item['ID']['S'])
            primary_key = str(newest_item_id + 1)
        else :
            primary_key = 1
            
        response = table.put_item(
            Item={
                'ID': str(primary_key),
                'Airpressure': airpressure,
                'Temperature': temperature,
                'Orpvalue': orpvalue,
                'Timestamp': current_time
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Data inserted successfully into DynamoDB') 
        }
    else :
        return{
            'statusCode' : 200,
            'body' :'method error'
        }
