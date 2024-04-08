import boto3
import json

def lambda_handler(event, context):
    requestMethod = event['httpMethod']
    if requestMethod == 'GET':
        # 建立 DynamoDB 用戶端
        dynamodb = boto3.client('dynamodb')
        
        # 指定 DynamoDB 表名稱
        table_name = 'programvalue'
        
       
        # 執行掃描操作，獲取整個表的資料
        response = dynamodb.scan(
            TableName=table_name,
        )
        
        # 提取結果中的記錄
        items = response.get('Items', [])
        
        # 按照ID進行排序，取最新的50條資料
        items.sort(key=lambda x: int(x['ID']['S']), reverse=True)
        sorted_items = items[:50]
        
        return {
            'statusCode': 200,
            'body': json.dumps(sorted_items)
        }


