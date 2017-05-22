class CreateLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :links do |t|
      t.integer :source_id
      t.integer :target_id
      t.integer :code
      t.integer :project_id
    end
  end
end
