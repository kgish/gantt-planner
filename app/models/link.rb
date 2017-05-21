class Link < ApplicationRecord
  validates :link_id, :source_id, :target_id, :code, presence: true
  validates_inclusion_of :code, :in => [ 0, 1, 2, 3 ]

  belongs_to :project
end
