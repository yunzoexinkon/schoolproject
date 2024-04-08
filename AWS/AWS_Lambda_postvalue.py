import json
import boto3
import time
from decimal import Decimal

def get_item_count(table):
    response = table.scan(Select='COUNT')
    return response['Count']

def lambda_handler(event, context):
    requestMethod = event['httpMethod']
    if requestMethod == 'POST' :
        # 建立 DynamoDB 客戶端
        dynamodb = boto3.resource('dynamodb')
        dynamodbsec = boto3.client('dynamodb')
        
        # 指定 DynamoDB 表名稱
        table_name = 'programvalue'
        
        # 取得 DynamoDB 表物件
        table = dynamodb.Table(table_name)
        
        # 獲取當前資料數量
        item_count = get_item_count(table)
        
        # 執行掃描操作，獲取整個表的資料
        response = dynamodbsec.scan(
            TableName=table_name,
        )
        # 提取結果中的記錄
        items = response.get('Items', [])
        
        # 如果資料數量超過定值（例如1000），則刪除最舊的資料
        if item_count >= 10000:
            # 獲取最舊的資料
            #oldest_item = table.scan(Select='ALL_ATTRIBUTES', Limit=1, ScanFilter={}).get('Items')[0]
            
            # 刪除最舊的資料
            #table.delete_item(Key={'PrimaryKey': oldest_item['PrimaryKey']})
            
            # 按照ID進行排序，取最舊的一條資料
            items.sort(key=lambda x: int(x['Timestamp']['S']), reverse=False)
            oldest_item = items[0]
            oldest_item_timestamp = oldest_item['Timestamp']['S']
            response = dynamodbsec.delete_item(
                TableName=table_name,
                Key={'Timestamp': {'S': oldest_item_timestamp}}  # 替換為您的 ID 欄位名稱和最舊項的 ID
            )
        
        # 從 Lambda 事件中取得資料
        data = json.loads(event['body'])
        
        # 加入主鍵（使用 Lambda 唯一的請求 ID）
        if item_count > 0 :
            # 按照ID進行排序，取最舊的一條資料
            items.sort(key=lambda x: int(x['ID']['S']), reverse=True)
            newest_item = items[0]
            newest_item_id = int(newest_item['ID']['S'])
            primary_key = str(newest_item_id + 1)
        else :
            primary_key = 1
        
        airpressure = Decimal(str(data['Airpressure']))
        temperature = Decimal(str(data['Temperature']))
        orpvalue = Decimal(str(data['Orpvalue']))
        current_time = str(data['Nowtime'])
        
        # 寫入資料到 DynamoDB
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

