# NTUT-WAR-GAMING(NWG)  
消防局兵棋推演輔助系統

### [DEMO](http://ntut-war-game.herokuapp.com)

### 系統需求
  據傳在兵棋推演的時候, 是召集所有單位坐在一個辦公室, 聽台上的人講目前發生的狀況,應該如何處理.  
  隨聽隨忘,好不快樂...所以需要有一個系統讓下屬單位能夠參與增加印象etc...
  
### 系統流程 ###
  1. 使用者進入系統後 10 秒會於地圖上顯示一個隨機事件點
  2. 左方所有單位列表會依據這個事件點, 計算各單位抵達這個事件點的時間(Google Direction API https://developers.google.com/maps/documentation/directions/?hl=zh-tw
  3. 使用者可以選擇每一個單位要派出的資源數量
  4. 統計所有資源數量
  5. 派出單位資源
  6. 於圖片呈現資源前往事件發生點的過程
  7. END
  8. 聊天室

### 系統功能  
  NWG主要是協助消防局再進行兵棋推演時，能夠讓協辦單位有事情可以做(?)的一個小系統。
  主要的功能有:
  - 頂端有一個目前事件發生情況(先用假資料, 過10秒會換目前情況)
  - 有一個Google Maps地圖 (其實應該是兩個, 包含左下角Eagle-Map的話), zoom out fixed, pan boundary fixed, foucus in Taipei.
  - Eagle-Map上的紅色框會隨著主地圖的中心點移動
  - 左邊會有一個Tree List, 會列出目前單位(可能是消防局/警察局)使用者底下所有的中隊/分局, 使用者可以點選然後會在下面的資源列表的地方列出這個中隊/分局目前可以的資源
  - 最下方是該單位的可派送資源(ex: 消防車/警察車...etc)並且會及時更新所有單位的集合派送資源, icon等傳說中的設計師出現的時候會設計, 先不用管
  - 右邊有一個聊天室, 可以看到目前裡面有誰, 如果在上面的使用者列表選了其中一個單位, 在對話框就會出現xxx對yyy說:zzz 類似這樣子的東西

## TODO
 - 所有分局/大隊選完派送資源後, 要出現確認視窗
 - 確認OK後派送
 - 派送時進行圖面呈現
 - UI/UX
 
### 應用技術
* Google Maps API
* Google Direction API
* React
* React-dom
* React Tree Menu
* gulp 
* bootstrap css
* socketIO
* nodejs
* Express
* MongoDB, MongoLab
* heroku to cloud deploy
* a little jquery

### 心得
This is my first react + nodejs + express project.
The project look ugly actually...NEED REFACTORY!  
這是第一個 reactjs + nodejs + express專案, 開發時間大約一個月, 原本打算用ZK的, 但是台灣實在太少人用了, 想想還是放棄. 用起來感覺熟悉的畫開發真的很快速, 但是還沒有開始導入 Redux總是用setState在做state的修改, 在專案長大的時候真的越來越可怕...需要做一些重構...  

### More to do
* create a React Component for handle Google maps and so on.
* 導入Redux Handle statet, action, and make more clean project.

**Feel free to ask me anything about this project and feedback is always welcome.**
