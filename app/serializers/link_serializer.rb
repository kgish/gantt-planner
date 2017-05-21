class LinkSerializer < ActiveModel::Serializer
  attributes :id, :link_id, :source_id, :target_id, :code

  belongs_to :project
end
