class LinkSerializer < ActiveModel::Serializer
  attributes :id, :code

  belongs_to :source, class_name: 'Task'
  belongs_to :target, class_name: 'Task'
end
