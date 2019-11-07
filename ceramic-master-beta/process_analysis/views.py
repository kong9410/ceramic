from django.shortcuts import render
from django.http import JsonResponse
from .models import FactoryAnalysis
from .anomaly import AnomalyDetect

from .correlation import correlation_graph, plotXY

import pandas as pd
import math
import json

# Create your views here.

def outlier_batch(request):
    options = FactoryAnalysis.objects.all().values('factory', 'line', 'process').distinct()

    factories = []
    lines = []
    processes = []
    factor_names = []
    for option in options:
        if option['factory'] not in factories:
            factories.append(option['factory'])
        if option['line'] not in lines:
            lines.append(option['line'])
        if option['process'] not in processes:
            processes.append(option['process'])

    factors_ = FactoryAnalysis.objects.mongo_find_one({}, {'data': 1})

    if factors_ is not None:
        product_data = factors_['data']
        factor_names = product_data['factor_names']

    return render(request, 'process_analysis/outlier_batch.html', {
        'factories': factories,
        'lines': lines,
        'processes': processes,
        'factor_names': factor_names
    })


def outlier_batch_ajax(request):
    factory = request.POST.get('factory', None)
    line = request.POST.get('line', None)
    process = request.POST.get('process', None)

    start_dt = request.POST.get('start_dt', '2018-01-01')
    end_dt = request.POST.get('end_dt', '2018-12-31')

    factor = request.POST.get('factor', "0=milling_start")

    factor_id, factor_name = factor.split('=', 1)

    print('dates', start_dt, end_dt)

    result_ = FactoryAnalysis.objects.mongo_aggregate([
        {'$project': {
            '_id': 0,
            'product_date': 1,
            'factory': 1,
            'line': 1,
            'process': 1,
            factor_name: {'$arrayElemAt': ['$data.factor_values', int(factor_id)]},
            'isBetween': {
                '$and': [{
                    '$lte': [{'$dateFromString': {'dateString': '$product_date'}},
                             {'$dateFromString': {'dateString': end_dt}}]
                }, {
                    '$gte': [{'$dateFromString': {'dateString': '$product_date'}},
                             {'$dateFromString': {'dateString': start_dt}}]
                }]
            }

        }},
        {'$match': {'$and': [{'factory': factory}, {'line': line}, {'process': process}, {factor_name: {'$ne': ''}},
                             {'isBetween': True}]}}
    ])

    df = pd.DataFrame(list(result_))

    result = []
    data_q = True

    if df.size > 0:
        anomaly = AnomalyDetect()

        try:
            df = anomaly.elliptic_envelope(df, 4, 0.15)
            # df = anomaly.isolation_forest(df, factor_name)

            for _, rows in df.iterrows():
                result.append(
                    {'product_date': rows.product_date, 'result': rows[factor_name], 'outlier': rows['outlier']})

        except Exception as e:
            print('eee', str(e))
            data_q = False

    return JsonResponse({'factory': factory, 'line': line, 'process': process, 'factor': factor_name, 'results': result,
                         'data_q': data_q})


def correlation(request):
    options = FactoryAnalysis.objects.all().values('factory', 'line', 'process').distinct()

    factories = []
    lines = []
    processes = []
    for option in options:
        if option['factory'] not in factories:
            factories.append(option['factory'])
        if option['line'] not in lines:
            lines.append(option['line'])
        if option['process'] not in processes:
            processes.append(option['process'])

    return render(request, 'process_analysis/correlation.html', {
        'factories': factories,
        'lines': lines,
        'processes': processes,
    })


def correlation_ajax(request):
    factory = request.POST.get('factory', None)
    line = request.POST.get('line', None)
    process = request.POST.get('process', None)
    mode = request.POST.get('mode', None)

    result_ = FactoryAnalysis.objects.mongo_aggregate([
        {'$project': {
            '_id': 0,
            'product_date': 1,
            'factory': 1,
            'line': 1,
            'process': 1,
            'quality': 1,
            'data': 1
        }},
        {'$match': {'$and': [{'factory': factory}, {'line': line}, {'process': process}]}}
    ])

    result = []

    for ro in result_:
        row = {}

        product_data = ro['data']
        ndx = 0
        for v in product_data['factor_names']:

            try:
                val = float(product_data['factor_values'][ndx])
                row[v] = val
            except:
                pass
            ndx += 1

        row['quality'] = ro['quality']

        result.append(row)

    df = pd.DataFrame(list(result))

    dataset = []
    for col in df.columns:
        if col != 'quality':
            data = df[col].tolist()

            data = [value for value in data if not math.isnan(value)]

            data.insert(0, col)
            dataset.append(data)

    myObj = {
        'dataset': dataset
    }

    if df.size > 0:
        anomaly = AnomalyDetect()

        # Result (label) ↔ Factors
        cats, data = anomaly.pointbiserialr(df, 'quality')
        myObj['rf'] = {'cats': cats, 'data': data}

        # Factors ↔ Factors

        df2 = df.drop(['quality', 'code'], axis=1)
        ff = anomaly.pearsonr(df2)

        myObj['ff'] = ff
    
    if df.size > 0:
        keyname = df.keys()
        regression_data = plotXY.plot_x_y_context(df, keyname[0], keyname[1])

        myObj['regression_data'] = regression_data
    print(myObj)
    return JsonResponse(myObj)

# url correlation/heatmap > heatmap_correlation.html
def heatmap_correlation(request):
    options = FactoryAnalysis.objects.all().values('factory', 'line', 'process').distinct()

    factories = []
    lines = []
    processes = []
    for option in options:
        if option['factory'] not in factories:
            factories.append(option['factory'])
        if option['line'] not in lines:
            lines.append(option['line'])
        if option['process'] not in processes:
            processes.append(option['process'])

    return render(request, 'process_analysis/heatmap_correlation.html', {
        'factories': factories,
        'lines': lines,
        'processes': processes,
    })

def heatmap_correlation_ajax(request):
    factory = request.POST.get('factory', None)
    line = request.POST.get('line', None)
    process = request.POST.get('process', None)

    result_ = FactoryAnalysis.objects.mongo_aggregate([
        {'$project': {
            '_id': 0,
            'product_date': 1,
            'factory': 1,
            'line': 1,
            'process': 1,
            'quality': 1,
            'data': 1
        }},
        {'$match': {'$and': [{'factory': factory}, {'line': line}, {'process': process}]}}
    ])

    result = []

    # dictionary에서 dataframe으로 변환
    for ro in result_:
        row = {}

        product_data = ro['data']
        ndx = 0
        for v in product_data['factor_names']:

            try:
                val = float(product_data['factor_values'][ndx])
                row[v] = val
            except:
                pass
            ndx += 1

        row['quality'] = ro['quality']

        result.append(row)

    df = pd.DataFrame(list(result))
    myObj = {}
    df_corr = df.corr('pearson')

    print('Correlation Result\n========================================================')
    print(df_corr)
    print('========================================================')

    context = {'data':correlation_graph.heatmap_correlation(df_corr)}
    print(context['data'])
    return JsonResponse(context)