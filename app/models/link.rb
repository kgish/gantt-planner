class Link < ApplicationRecord
  validates :source, :target, :code, presence: true
  validates_inclusion_of :code, :in => [ 0, 1, 2, 3 ]
end
