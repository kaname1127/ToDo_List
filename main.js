
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
    fetch: function () {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        todos.forEach(function (todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}


new Vue({
    el: '#app',

    data: {
        // localStorage から 取得した ToDo のリスト
        todos: [],
        // 抽出しているToDoの状態
        current: -1,
        // 各状態のラベル
        options: [
            { value: -1, label: 'すべて' },
            { value: 0, label: '作業中' },
            { value: 1, label: '完了' }
        ]
    },

    computed: {

        computedTodos: function () {
            return this.todos.filter(function (el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        },

        // 作業中・完了のラベルを表示
        labels() {
            return this.options.reduce(function (a, b) {
                return Object.assign(a, { [b.value]: b.label })
            }, {})
        }
    },

    watch: {
        // オプションを使う場合はオブジェクト形式にする
        todos: {
            // 引数としてウォッチしているプロパティの変更後の値を与える
            handler: function (todos) {
                todoStorage.save(todos)
            },
            // deep オプションでネストしているデータを監視
            deep: true
        }
    },

    created() {
        // インスタンス作成時に自動的に fetch() する
        this.todos = todoStorage.fetch()
    },

    methods: {

        // ToDo 追加処理
        doAdd: function (event, value) {
            // ref で名前を付けておいた要素を参照
            var comment = this.$refs.comment
            // 入力がなければ何もしないで return
            if (!comment.value.length) {
                return
            }
            // { 新しいID, コメント, 作業状態 }
            // というオブジェクトを現在の todos リストへ push
            // 作業状態「state」はデフォルト「作業中=0」で作成
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            })
            // フォーム要素を空にする
            comment.value = ''
        },

        // 状態変更処理
        doChangeState: function (item) {
            item.state = !item.state ? 1 : 0
        },

        // 削除処理
        doRemove: function (item) {
            var index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        }

    }
})