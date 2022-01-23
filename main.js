const STORAGE_KEY = 'todos';
const todoStorage = {
  fetch: function () {
    const todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );
    todos.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

new Vue({
  el: '#app',
  data: {
    editIndex: -1,
    todos: [],
    prosessing: false
  },
  computed: {
    changeButtonText: function () {
      return this.editIndex === -1 ? '追加' : '編集';
    }
  },
  watch: {
    todos: {
      handler: function (todos) {
        todoStorage.save(todos);
      },
      deep: true
    }
  },
  created () {
    this.todos = todoStorage.fetch();
  },
  methods: {
    startProcessing: function () {
      this.processing = true;
    },
    endProcessing: function () {
      this.processing = false;
    },
    isProcessing: function () {
      return this.processing;
    },
    addNewComment: function (event, value) {
      this.todos.push({
        id: todoStorage.uid++,
        comment: this.$refs.comment.value
      });
    },
    addEditedComment: function (event, value) {
      const editedComment = {
        id: this.editIndex,
        comment: this.$refs.comment.value
      }
      this.todos.splice(this.editIndex, 1, editedComment);
    },
    setItems: function () {
      const comment = this.$refs.comment;
      if (!comment.value.length) {
        return;
      }
      if (this.editIndex === -1) {
        this.addNewComment();
      } else {
        this.addEditedComment();
        this.endProcessing();
      }
      comment.value = '';
      this.editIndex = -1;
    },
    remove: function (item) {
      const index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    },
    edit: function (item) {
      this.editIndex = this.todos.indexOf(item);
      const text = this.todos[this.editIndex].comment;
      const comment = this.$refs.comment;
      comment.value = text;
      comment.focus();
      this.startProcessing();
    }
  }
});
