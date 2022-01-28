const STORAGE_KEY = 'todos';
const todoStorage = {
  fetch() {
    const todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );
    todos.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

const app = {
  el: '#app',
  data() {
    return {
      todos: [],
      editIndex: -1,
      comment: null,
    }
  },
  computed: {
    changeButtonText() {
      return this.editIndex === -1 ? '追加' : '編集';
    },
    isProcessing() {
      return (this.editIndex >= 0);
    }
  },
  created() {
    this.todos = todoStorage.fetch();
  },
  methods: {
    addNewComment() {
      this.todos.push({
        id: todoStorage.uid++,
        comment: this.comment
      });
      todoStorage.save(this.todos);
    },
    addEditedComment() {
      const editedComment = {
        id: this.editIndex,
        comment: this.comment
      }
      this.todos.splice(this.editIndex, 1, editedComment);
      todoStorage.save(this.todos);
    },
    setItems() {
      if (!this.comment.length) {
        return;
      }
      if (this.editIndex === -1) {
        this.addNewComment();
      } else {
        this.addEditedComment();
      }
      this.comment = '';
      this.editIndex = -1;
    },
    remove(item) {
      const index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
      todoStorage.save(this.todos);
    },
    edit(item) {
      this.editIndex = this.todos.indexOf(item);
      const text = this.todos[this.editIndex].comment;
      this.comment = text;
      this.$refs.form.focus();
    }
  }
};

Vue.createApp(app).mount('#app');
