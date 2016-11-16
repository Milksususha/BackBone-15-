$(function() {
	//пространство имён
	window.App = {
		Models: {},
		Collections:{},
		Views: {}
	};
	//шаблон
	window.template = function(id) {
	   return _.template( $('#' + id).html() );
	};

App.Models.Task = Backbone.Model.extend({
	validate:function(attrs){
		if(!$.trim(attrs.title)){
		return 'Имя задачи должно быть валидным!!';
	}
	}
});

App.Views.Task = Backbone.View.extend({
	initialize: function(){
		
	//_.bindAll(this,'editTask','render')	
	this.model.on ('change', this.render, this);
	this.model.on ('destroy', this.remove, this);
	},
	tagName:'li',
	template: template('taskTemplate'),
	render: function () {
		var template  = this.template(this.model.toJSON());
		
		this.$el.html(template );
		return this;
	},
	events:{
	  'click .edit': 'editTask',
	  'click .delete': 'destroy'
	},
	destroy: function (){
	  this.model.destroy();
	},
	remove: function (){
		this.$el.remove();
	},
	editTask: function () {
	var newTaskTitle =  prompt('Как переименуем задачу?', this.model.get('title'));
	//if(!newTaskTitle) return;
	 this.model.set('title', newTaskTitle);

	}
});
App.Collections.Task = Backbone.Collection.extend({
	model: App.Models.Task
});

App.Views.Tasks = Backbone.View.extend({
	 tagName: 'ul',
	 render: function () {
		  this.collection.each(this.addOne,this);
		  return this;
	 },
	 addOne: function (task) {
		 // создавать новый дочерний вид 
		 var taskView = new App.Views.Task({ model: task});
		 //добавлять его в корневой элемент 
		 this.$el.append(taskView.render().el);
	 }
})

window.tasksCollection = new App.Collections.Task([
{
	title: 'Сходить в магазин',
	priority: 4
},
{
	title: 'Получить почту',
	priority: 3
},
{
	title: 'Сходить на работу',
	priority: 5
},
]);
var tasksView = new App.Views.Tasks({collection:  tasksCollection});


$('.tasks').html(tasksView.render().el);

});