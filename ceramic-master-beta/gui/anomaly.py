import pandas as pd
import numpy as np
import math

from sklearn.covariance import EllipticEnvelope
from sklearn.ensemble import IsolationForest
from scipy import stats



class AnomalyDetect():
    def elliptic_envelope(self, dataset, featureInd, contamination):
        ell = EllipticEnvelope(contamination=contamination)

        features = dataset.iloc[:,[featureInd]].values

        print(features)

        ell.fit(features)
        outlier = ell.predict(features)

        # dec = ell.decision_function(features)

        # loc_ = ell.location_ 
        # cov_ = ell.covariance_
        # print("loc", loc_, "cov", cov_)

        dataset['outlier'] = outlier

        return dataset

    def isolation_forest(self, dataset, feature):

        forest = IsolationForest(n_estimators=100, contamination=0.1, behaviour='new')
        forest.fit(dataset[feature].values.reshape(-1,1))

        print(dataset[feature].min(), dataset[feature].max())
        xx = np.linspace(float(dataset[feature].min()), float(dataset[feature].max()), len(dataset)).reshape(-1,1)
        
        anomaly_score = forest.decision_function(xx)

        outlier = forest.predict(xx)

        dataset['outlier'] = outlier

        print(anomaly_score[:15])

        print(outlier[:15])


        est_ = forest.offset_ 

        print(est_)

        return dataset
    
    def boxplot(self, dataset, featureInd, feature = None):
        pass
        
    def pointbiserialr(self, dataset, specName = 0):
        dataset['code'] = pd.factorize(dataset[specName])[0] + 1
        dataset = dataset.drop([specName], axis=1)

        sizes = ['size']
        corrs = ['correlation']
        cats = []


        for col in dataset.columns:
            if col != 'code':
                dataset2 = dataset.filter([col, 'code'], axis=1)
                dataset2 = dataset2.dropna()
                
                features = dataset2.iloc[:, 0].values
                labels = dataset2.iloc[:, 1].values
                
                result = stats.pointbiserialr(features, labels)

                if math.isnan(result.correlation) == False and math.isinf(result.correlation) == False:
                    sizes.append(len(features))
                    corrs.append(result.correlation * 100) 
                    cats.append(col)
                

        return cats, [corrs, sizes]

    def pearsonr(self, dataset):

        dataset = dataset.dropna()

        cols = []
        
        for col in dataset.columns:
            cols.append(col)
        
        colsInd = self.combineCols(cols)
        

        corrs = []
        print("===========CORS===============")
        for col in colsInd:
            features1=dataset.iloc[:,col[0]].values
            features2=dataset.iloc[:,col[1]].values

            result = stats.pearsonr(features1, features2)

            corrs.append({'x': cols[col[0]], 'y': cols[col[1]], 'value': result[0]})
            if cols[col[0]] != cols[col[1]]:
                corrs.append({'x': cols[col[1]], 'y': cols[col[0]], 'value': result[0]})
        return corrs

    def combineCols(self, cols):
        cCols = []
        ln = len(cols)

        for ndx, _ in enumerate(cols):
            for i in range(ndx, ln):
                cCols.append([ndx, i])
        return cCols