class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :text, :start_date, :duration, :progress
end
