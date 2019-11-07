# 회귀 곡선 관련 모듈
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import PolynomialFeatures

import pandas as pd
import numpy as np
import itertools

# mongo 모듈
import pymongo as pm

class mongodb:
    def __init__(self, hostname='localhost', port=27017):
        self.conn = pm.MongoClient(hostname, port)
    
    def set_db(self, dbname):
        self.db = self.conn.get_database(dbname)
        return self.db

    def set_collection(self, collection_name):
        self.collection = self.db.get_collection(collection_name)
        return self.collection
    
    def get_collection(self):
        try:
            return self.collection
        except:
            print("you need to use set_collection before use get_collection")
            return None

class correlation_graph:

    # 회귀선 생성
    # 데이터프레임, x 값 이름, y 값 이름, 차수
    # 반환값 : x 데이터, y 데이터, 회귀선x 리스트, 회귀선y 리스트
    def quadratic_y_values(df, x_name, y_name, degree=2):
        print("quadratic Y Values")
        X = df[[x_name]].values
        Y = df[y_name].values
        x_batch = np.std(X)
        lr = LinearRegression()
        quadratic = PolynomialFeatures(degree=degree)
        X_quad = quadratic.fit_transform(X)
        X_fit = np.arange(0, X.max()+1, X.max() / len(X))[:, np.newaxis]
        lr.fit(X_quad, Y)
        y_quad_fit = lr.predict(quadratic.fit_transform(X_fit))
        X_fit = list(itertools.chain(*X_fit))
        X = list(df[x_name].values)
        return X, Y, X_fit, y_quad_fit

    def heatmap_correlation(df):
        heatmap = []
        for col1 in df.keys() :
            tmp = {}
            for col2 in df.keys():
                tmp['x'] = col1
                tmp['y'] = col2
                tmp['value'] = df[col1][col2]
                heatmap.append(tmp)
            
        return heatmap

class plotXY:
    def plot_x_y_context(df, x_name, y_name, degree=2):
        print("Plot XY Context")
        print(df.head())
        factor_names = df.keys()
        # << factor 이름을 request에 맞게 변환 필요 >>
        input_name = factor_names[0]
        output_name = factor_names[1]
        
        # 문자열을 숫자로 바꾸고 NAN 행 제거
        # df[output_name] = pd.to_numeric(df[output_name], errors='coerce')
        df = df.dropna(axis = 0)
        # x, y scatter 값과 회귀 곡선을 그리는 좌표 반환
        x, y, x_fit, y_quad = correlation_graph.quadratic_y_values(df, input_name, output_name)
        #x, y, x_fit, y_quad = correlation_graph.quadratic_y_values(df=df, x_name=input_name, y_name=output_name)
        
        x_fit = list(itertools.chain(x_fit))

        x = list(x)
        y = list(y)
        y_quad = list(y_quad)

        scatter_len = len(x)
        fit_len = len(x_fit)
        # print(mean_confidence_interval(y_quad))

        for idx in range(scatter_len):
            x[idx] = float(x[idx])
            y[idx] = float(y[idx])
        
        for idx in range(fit_len):
            x_fit[idx] = float(x_fit[idx])
            y_quad[idx] = float(y_quad[idx])

        x_label = factor_names[0]
        y_label = factor_names[1]

        x.insert(0, 'x_data')
        y.insert(0, y_label + '/' + x_label)
        x_fit.insert(0, 'x_fit')
        y_quad.insert(0, 'Regression')


        context = {
            "x_data" : x,
            "y_data" : y,
            "x_label" : x_label,
            "y_label" : y_label,
            "x_fit" : x_fit,
            "y_quad" : y_quad
        }

        return context
    

