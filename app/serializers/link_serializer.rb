class LinkSerializer < ActiveModel::Serializer
  attributes :id, :source_id, :target_id, :code, :project_id

end
