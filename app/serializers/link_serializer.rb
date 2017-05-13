class LinkSerializer < ActiveModel::Serializer
  attributes :id, :source, :target, :type
end
