class TaskSerializer < ActiveModel::Serializer
  attributes :id, :text, :start_date, :duration, :progress, presence: :true

  belongs_to :parent, class_name: 'Task'
  belongs_to :topmost, class_name: 'Task'

  has_many :subtasks, class_name: 'Task'
  has_many :links
end
