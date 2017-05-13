class TaskSerializer < ActiveModel::Serializer
  attributes :id, :text, :start_date, :duration, :progress, :sortorder, :parent
end
