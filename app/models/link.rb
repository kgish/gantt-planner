class Link < ApplicationRecord
  validates :source_id, :target_id, :project_id, presence: true
  validates_inclusion_of :code, :in => [ 0, 1, 2, 3 ]

end
