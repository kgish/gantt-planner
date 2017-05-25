class Link < ApplicationRecord
  validates :source, :target, :project, presence: true
  validates_inclusion_of :code, :in => [ 0, 1, 2, 3 ]
end
