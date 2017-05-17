class TaskSerializer < ActiveModel::Serializer
  attributes :id, :task_id, :text, :start_date, :duration, :progress, :sortorder, :parent_id, :project_id
end
