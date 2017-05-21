class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :project_id, :text, :start_date, :duration, :progress, :sortorder

  has_many :tasks
  has_many :links
end
