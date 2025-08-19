# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
// int reversernum(vector<int> array){
//     int n=array.size();
//     int start=0;
//     int end=n-1;
    
//     while(start < end){
//         swap(array[start] , array[end]);
//         start++;
//         end--;
//     }
//     return array;
// }
bool find(int n){
    vector<int> array;
    while( n < 0){
        int sum=n % 10;
        array.push_back(sum);
        n=n/10;
    }
    
    reverse(array.begin(),array.end());
    
    // int n=array.size();
    // int start=0;
    // int end=n-1;
    // while(start < end){
        
    // }
    vector<int>firststrev;
    vector<int>secondndrev;
    for(int i=array.size();i>=0;i--){
        firststrev.push_back(array[i]);
    };
    
    if(firststrev[0]==0){
        return false;
    }
    
    for(int i=firststrev.size();i>=0;i--){
        secondndrev.push_back(firststrev[i]);
    }
    
    for(int i=0;i<firststrev.size();i++){
        for(int j=0;j<secondndrev.size();j++){
            if(firststrev[i]!=secondndrev[j]){
                return false;
            }
        }
    }
    return true;
}
int main(){
    int n;
    cout<<"enter the num : ";
    cin>>n;
    
    if(find(n)){
        cout<<"true";
    }else{
        cout<<"false";
    }
}
