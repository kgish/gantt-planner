class Link < ApplicationRecord
  validates :source, :target, :_type, presence: true
  validates_inclusion_of :_type, :in => [ 0, 1, 2, 3 ]
end
